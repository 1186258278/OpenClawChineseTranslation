import importlib.util
import pathlib
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('images', ROOT / 'scripts/verify-container-images.py')
images = importlib.util.module_from_spec(spec)
spec.loader.exec_module(images)


class RegistryTests(unittest.TestCase):
    def config(self):
        return {'config': {'Cmd': images.DEFAULT_COMMAND[:],
                           'Healthcheck': {'Test': ['CMD-SHELL', 'curl http://127.0.0.1:18789/healthz']},
                           'Labels': {'org.opencontainers.image.version': '2026.9.4-zh.1'}}}

    def test_fixed_config(self):
        images.validate_config(self.config(), '2026.9.4-zh.1')

    def test_bare_cli_is_rejected(self):
        value = self.config()
        value['config']['Cmd'] = ['openclaw']
        with self.assertRaisesRegex(ValueError, 'gateway'):
            images.validate_config(value, '2026.9.4-zh.1')

    def test_wrong_version_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'version label'):
            images.validate_config(self.config(), '2026.9.4-zh.2')

    def test_missing_healthcheck_is_rejected(self):
        value = self.config()
        del value['config']['Healthcheck']
        with self.assertRaisesRegex(ValueError, 'healthz'):
            images.validate_config(value, '2026.9.4-zh.1')

    def test_matching_registries(self):
        images.verify_matching_images([{'tag': 'latest', 'digest': 'same'}, {'tag': 'latest', 'digest': 'same'}])

    def test_different_registries_fail(self):
        with self.assertRaisesRegex(ValueError, 'different images'):
            images.verify_matching_images([{'tag': 'latest', 'digest': 'a'}, {'tag': 'latest', 'digest': 'b'}])

    def test_missing_architecture_fails(self):
        with patch.object(images, 'request_json', side_effect=[({'token': 'fixture'}, ''),
                            ({'manifests': [{'platform': {'os': 'linux', 'architecture': 'amd64'}}]}, '')]):
            with self.assertRaisesRegex(ValueError, 'wrong platforms'):
                images.inspect_registry('ghcr.io', '1186258278', ['latest'])


if __name__ == '__main__':
    unittest.main()
